export function handleError(err, res) {
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: err.errors.map((e) => e.message)
    })
  }

  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    })
  }

  return res.status(500).json({
    error: 'Erro interno no servidor'
  })
}
