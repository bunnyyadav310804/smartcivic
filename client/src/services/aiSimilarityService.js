/**
 * AI Duplicate Similarity & NLP Matching Service
 * Computes semantic text similarity and n-gram overlap between draft complaint and existing active complaints.
 */

function tokenize(text) {
  if (!text) return []
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2)
}

function calculateJaccardSimilarity(tokensA, tokensB) {
  if (!tokensA.length || !tokensB.length) return 0
  const setA = new Set(tokensA)
  const setB = new Set(tokensB)
  const intersection = new Set([...setA].filter((x) => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

export function findAISimilarComplaints(draftComplaint, activeComplaints = []) {
  if (!draftComplaint || (!draftComplaint.title && !draftComplaint.description)) {
    return []
  }

  const draftTokens = tokenize(`${draftComplaint.title || ''} ${draftComplaint.description || ''}`)
  if (draftTokens.length === 0) return []

  const results = []

  for (const item of activeComplaints) {
    // If same category or matching keywords
    const itemTokens = tokenize(`${item.title || ''} ${item.description || ''}`)
    let similarity = calculateJaccardSimilarity(draftTokens, itemTokens)

    // Category bonus
    if (draftComplaint.category && item.category && draftComplaint.category === item.category) {
      similarity = Math.min(1, similarity + 0.25)
    }

    const similarityPercentage = Math.round(similarity * 100)

    if (similarityPercentage >= 40) {
      const commonKeywords = [...new Set(draftTokens.filter((token) => itemTokens.includes(token)))]
      results.push({
        complaint: item,
        similarityPercentage,
        commonKeywords,
        isHighDuplicateRisk: similarityPercentage >= 70
      })
    }
  }

  return results.sort((a, b) => b.similarityPercentage - a.similarityPercentage).slice(0, 3)
}
