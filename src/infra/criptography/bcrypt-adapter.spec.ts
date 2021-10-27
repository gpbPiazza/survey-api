describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct values', async () => {
    const bcryptAdapter = new BcryptAdapter()
    await bcryptAdapter.encrypt('any_value')
  })
})
