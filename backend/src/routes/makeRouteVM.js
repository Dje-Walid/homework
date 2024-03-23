import yup from "yup"
import mw from "../middlewares/mw.js"
import validate from "../middlewares/validate.js"
import fs from "fs"
import path from "path"
import { DefaultAzureCredential } from "@azure/identity"
import { ComputeManagementClient } from "@azure/arm-compute"
import { ResourceManagementClient } from "@azure/arm-resources"
import { StorageManagementClient } from "@azure/arm-storage"
import { NetworkManagementClient } from "@azure/arm-network"

const makeVm = ({ app }) => {
  const vmsFilePath = path.resolve("./src/data/vms.json")

  // Store function output to be used elsewhere
  let randomIds = {}
  let subnetInfo = null
  let publicIPInfo = null
  let vmImageInfo = null
  let nicInfo = null

  // Resource configs
  const location = "francecentral"
  const accType = "Standard_LRS"

  const vmConfig = {
    Linux: {
      publisher: "Canonical",
      offer: "UbuntuServer",
      sku: "16.04.0-LTS",
      version: "latest",
      vmSize: "Standard_B1ls",
    },
    Windows: {
      publisher: "MicrosoftWindowsDesktop",
      offer: "Windows-10",
      sku: "2Oh2-pro",
      version: "latest",
      vmSize: "Standard_B2s",
    },
    Debian: {
      publisher: "Debian",
      offer: "debian-11",
      sku: "11",
      version: "latest",
      vmSize: "Standard_B1ls",
    },
  }

  // Azure platform authentication
  const clientId = process.env["AZURE_CLIENT_ID"]
  const domain = process.env["AZURE_TENANT_ID"]
  const secret = process.env["AZURE_CLIENT_SECRET"]
  const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"]

  const credentials = new DefaultAzureCredential()

  // Azure services
  const resourceClient = new ResourceManagementClient(
    credentials,
    subscriptionId,
  )
  const computeClient = new ComputeManagementClient(credentials, subscriptionId)
  const storageClient = new StorageManagementClient(credentials, subscriptionId)
  const networkClient = new NetworkManagementClient(credentials, subscriptionId)

  app.post(
    "/createVm",
    validate({
      body: {
        username: yup.string(),
        password: yup.string(),
        name: yup.string(),
        type: yup.string(),
      },
    }),
    mw(async (req, res) => {
      const { username, password, name, type } = req.body

      console.log("got in")

      const resourceGroupName = _generateRandomId(name, randomIds)
      const storageAccountName = _generateRandomId(name, randomIds)
      const vnetName = _generateRandomId(name, randomIds)
      const subnetName = _generateRandomId(name, randomIds)
      const publicIPName = _generateRandomId(name, randomIds)
      const networkInterfaceName = _generateRandomId(name, randomIds)
      const ipConfigName = _generateRandomId(name, randomIds)
      const domainNameLabel = _generateRandomId(name, randomIds)
      const osDiskName = _generateRandomId(name, randomIds)

      await createRessources(
        username,
        password,
        name,
        type,
        resourceGroupName,
        storageAccountName,
        vnetName,
        subnetName,
        publicIPName,
        networkInterfaceName,
        ipConfigName,
        domainNameLabel,
        osDiskName,
      )

      const newVM = {
        username,
        password,
        name,
        type,
      }

      // Lecture du contenu actuel du fichier vms.json
      fs.readFile(vmsFilePath, "utf8", (err, data) => {
        let vms = []

        if (data) {
          try {
            vms = JSON.parse(data)
          } catch (parseError) {
            res.sendStatus(500)

            return
          }
        }

        vms.push(newVM)

        fs.writeFile(
          vmsFilePath,
          JSON.stringify(vms, null, 2),
          "utf8",
          (writeErr) => {
            if (writeErr) {
              res.sendStatus(500)

              return
            }
          },
        )
      })
    }),
  )

  const createRessources = async (
    username,
    password,
    name,
    type,
    resourceGroupName,
    storageAccountName,
    vnetName,
    subnetName,
    publicIPName,
    networkInterfaceName,
    ipConfigName,
    domainNameLabel,
    osDiskName,
  ) => {
    try {
      await createResourceGroup(resourceGroupName)
      await createStorageAccount(resourceGroupName, storageAccountName)
      await createVnet(resourceGroupName, vnetName, subnetName)
      await getSubnetInfo(resourceGroupName, vnetName, subnetName)
      await createPublicIP(resourceGroupName, domainNameLabel, publicIPName)
      nicInfo = await createNIC(
        resourceGroupName,
        ipConfigName,
        subnetInfo,
        publicIPInfo,
        networkInterfaceName,
      )
      vmImageInfo = await findVMImage(type)
      const nicResult = await getNICInfo(
        resourceGroupName,
        networkInterfaceName,
      )
      // eslint-disable-next-line no-console
      console.log(nicResult)
      await createVirtualMachine(
        resourceGroupName,
        name,
        username,
        password,
        type,
        nicInfo.id,
        osDiskName,
        storageAccountName,
      )

      return
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  const createResourceGroup = async (resourceGroupName) => {
    const groupParameters = {
      location: location,
      tags: { sampletag: "sampleValue" },
    }

    return await resourceClient.resourceGroups.createOrUpdate(
      resourceGroupName,
      groupParameters,
    )
  }

  const createStorageAccount = async (
    resourceGroupName,
    storageAccountName,
  ) => {
    const createParameters = {
      location: location,
      sku: {
        name: accType,
      },
      kind: "Storage",
      tags: {
        tag1: "val1",
        tag2: "val2",
      },
    }

    return await storageClient.storageAccounts.beginCreateAndWait(
      resourceGroupName,
      storageAccountName,
      createParameters,
    )
  }

  const createVnet = async (resourceGroupName, vnetName, subnetName) => {
    const vnetParameters = {
      location: location,
      addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
      },
      dhcpOptions: {
        dnsServers: ["10.1.1.1", "10.1.2.4"],
      },
      subnets: [{ name: subnetName, addressPrefix: "10.0.0.0/24" }],
    }

    return await networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
      resourceGroupName,
      vnetName,
      vnetParameters,
    )
  }

  const getSubnetInfo = async (resourceGroupName, vnetName, subnetName) => {
    return await networkClient.subnets.get(
      resourceGroupName,
      vnetName,
      subnetName,
    )
  }
  const createPublicIP = async (
    resourceGroupName,
    domainNameLabel,
    publicIPName,
  ) => {
    const publicIPParameters = {
      location: location,
      publicIPAllocationMethod: "Dynamic",
      dnsSettings: {
        domainNameLabel: domainNameLabel,
      },
    }

    return await networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
      resourceGroupName,
      publicIPName,
      publicIPParameters,
    )
  }

  const createNIC = async (
    resourceGroupName,
    ipConfigName,
    subnetInfo,
    publicIPInfo,
    networkInterfaceName,
  ) => {
    const nicParameters = {
      location: location,
      ipConfigurations: [
        {
          name: ipConfigName,
          privateIPAllocationMethod: "Dynamic",
          subnet: subnetInfo,
          publicIPAddress: publicIPInfo,
        },
      ],
    }

    return await networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
      resourceGroupName,
      networkInterfaceName,
      nicParameters,
    )
  }

  const findVMImage = async (type) => {
    return await computeClient.virtualMachineImages.list(
      location,
      vmConfig[type].publisher,
      vmConfig[type].offer,
      vmConfig[type].sku,
      { top: 1 },
    )
  }

  const getNICInfo = async (resourceGroupName, networkInterfaceName) => {
    return await networkClient.networkInterfaces.get(
      resourceGroupName,
      networkInterfaceName,
    )
  }

  const createVirtualMachine = async (
    resourceGroupName,
    name,
    username,
    password,
    type,
    nicId,
    osDiskName,
    storageAccountName,
  ) => {
    const vmParameters = {
      location: location,
      osProfile: {
        computerName: name,
        adminUsername: username,
        adminPassword: password,
      },
      hardwareProfile: {
        vmSize: "Standard_B1ls",
      },
      storageProfile: {
        imageReference: {
          publisher: vmConfig[type].publisher,
          offer: vmConfig[type].offer,
          sku: vmConfig[type].sku,
          version: vmConfig[type].version,
        },
        osDisk: {
          name: osDiskName,
          caching: "None",
          createOption: "fromImage",
          vhd: {
            uri:
              "https://" +
              storageAccountName +
              ".blob.core.windows.net/nodejscontainer/osnodejslinux.vhd",
          },
        },
      },
      networkProfile: {
        networkInterfaces: [
          {
            id: nicId,
            primary: true,
          },
        ],
      },
    }
    await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
      resourceGroupName,
      name,
      vmParameters,
    )
  }

  function _generateRandomId(prefix, existIds) {
    var newNumber

    // eslint-disable-next-line no-constant-condition
    while (true) {
      newNumber = prefix + Math.floor(Math.random() * 10000)

      if (!existIds || !(newNumber in existIds)) {
        break
      }
    }

    return newNumber
  }
}

export default makeVm
