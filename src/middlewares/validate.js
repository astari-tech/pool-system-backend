export function validate({ body, params, query }) {
  return (req, res, next) => {
    try {
      if (body) req.body = body.parse(req.body)
      if (params) req.params = params.parse(req.params)
      if (query) req.query = query.parse(req.query)
      next()
    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: err.errors.map((e) => e.message) })
      }
      return res.status(500).json({ error: 'Erro interno de validação' })
    }
  }
}
