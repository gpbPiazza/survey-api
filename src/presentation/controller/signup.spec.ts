import { SignUpController } from "./signupController";

describe('SignUp Controller', () => {
	test('Should return  400 if no name is provided ', () => {
		const signUp = new SignUpController();

		const httpRequest = {
			body: {
				email: 'any_email',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = signUp.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: name'))
	});

	test('Should return  400 if no email is provided ', () => {
		const signUp = new SignUpController();

		const httpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		}

		const httpResponse = signUp.handle(httpRequest)

		expect(httpResponse.statusCode).toBe(400)
		expect(httpResponse.body).toEqual(new Error('Missing param: email'))
	});
});