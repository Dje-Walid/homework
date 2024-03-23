const extract = (keys) => {
  const subExtract = (obj) =>
    Array.isArray(obj)
      ? obj.map(subExtract)
      : keys.reduce((sanitized, key) => ({ ...sanitized, [key]: obj[key] }), {})

  return subExtract
}

export const sanitizeCandidate = extract([
  "id",
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "curiculumVitaeUrl",
])

export const sanitizeJob = extract(["id", "title", "description", "status"])

export const sanitizeInterview = extract(["id", "review", "date"])

export const sanitizeRequirement = extract(["id", "title", "description"])
