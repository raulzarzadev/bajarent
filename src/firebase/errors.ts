//  lista de errores de login
// auth code errors list
export const authErrorsList = {
	'auth/app-deleted': { code: 1, text: 'No se encontró la base de datos' },
	'auth/expired-action-code': {
		code: 2,
		text: 'El código de acción o el enlace ha caducado'
	},
	'auth/invalid-action-code': {
		code: 3,
		text: 'El código de acción no es válido. Esto puede suceder si el código está mal formado o ya se ha utilizado'
	},
	'auth/user-disabled': {
		code: 4,
		text: 'El usuario correspondiente a la credencial proporcionada ha sido deshabilitado'
	},
	'auth/user-not-found': { code: 5, text: 'Usuario no existente' },
	'auth/weak-password': { code: 6, text: 'La contraseña es demasiado débil' },
	'auth/email-already-in-use': {
		code: 7,
		text: 'Ya tenía una cuenta con la dirección de correo electrónico proporcionada'
	},
	'auth/invalid-email': {
		code: 8,
		text: 'La dirección de correo electrónico no es válida'
	},
	'auth/operation-not-allowed': {
		code: 9,
		text: 'El tipo de cuenta correspondiente a esta credencial aún no está activado'
	},
	'auth/account-exists-with-different-credential': {
		code: 10,
		text: 'Correo electrónico ya asociado con otra cuenta'
	},
	'auth/auth-domain-config-required': {
		code: 11,
		text: 'No se ha proporcionado la configuración para la autenticación'
	},
	'auth/credential-already-in-use': {
		code: 12,
		text: 'Ya existe una cuenta para esta credencial'
	},
	'auth/operation-not-supported-in-this-environment': {
		code: 13,
		text: 'Esta operación no se admite en el entorno que se realiza. Asegúrese de que debe ser http o https'
	},
	'auth/timeout': {
		code: 14,
		text: 'Tiempo de respuesta excedido. Es posible que el dominio no esté autorizado para realizar operaciones'
	},
	'auth/missing-android-pkg-name': {
		code: 15,
		text: 'Se debe proporcionar un nombre de paquete para instalar la aplicación de Android'
	},
	'auth/missing-continue-uri': {
		code: 16,
		text: 'La siguiente URL debe proporcionarse en la solicitud'
	},
	'auth/missing-ios-bundle-id': {
		code: 17,
		text: 'Se debe proporcionar un nombre de paquete para instalar la aplicación iOS'
	},
	'auth/invalid-continue-uri': {
		code: 18,
		text: 'La siguiente URL proporcionada en la solicitud no es válida'
	},
	'auth/unauthorized-continue-uri': {
		code: 19,
		text: 'El dominio de la siguiente URL no está en la lista blanca'
	},
	'auth/invalid-dynamic-link-domain': {
		code: 20,
		text: 'El dominio de enlace dinámico proporcionado, no está autorizado o configurado en el proyecto actual'
	},
	'auth/argument-error': {
		code: 21,
		text: 'Verifique la configuración del enlace para la aplicación'
	},
	'auth/invalid-persistence-type': {
		code: 22,
		text: 'El tipo especificado para la persistencia de datos no es válido'
	},
	'auth/unsupported-persistence-type': {
		code: 23,
		text: 'El entorno actual no admite el tipo especificado para la persistencia de datos'
	},
	'auth/invalid-credential': {
		code: 24,
		text: 'La credencial ha caducado o está mal formada'
	},
	'auth/wrong-password': { code: 25, text: 'Contraseña incorrecta' },
	'auth/invalid-verification-code': {
		code: 26,
		text: 'El código de verificación de credencial no es válido'
	},
	'auth/invalid-verification-id': {
		code: 27,
		text: 'El ID de verificación de credencial no es válido'
	},
	'auth/custom-token-mismatch': {
		code: 28,
		text: 'El token es diferente del estándar solicitado'
	},
	'auth/invalid-custom-token': {
		code: 29,
		text: 'El token proporcionado no es válido'
	},
	'auth/captcha-check-failed': {
		code: 30,
		text: 'El token de respuesta reCAPTCHA no es válido, ha caducado o el dominio no está permitido'
	},
	'auth/invalid-phone-number': {
		code: 31,
		text: 'El número de teléfono está en un formato no válido (estándar E.164)'
	},
	'auth/missing-phone-number': {
		code: 32,
		text: 'El número de teléfono es obligatorio'
	},
	'auth/quota-exceeded': { code: 33, text: 'Se ha excedido la cuota de SMS' },
	'auth/cancelled-popup-request': {
		code: 34,
		text: 'Solo se permite una solicitud de ventana emergente a la vez'
	},
	'auth/popup-blocked': {
		code: 35,
		text: 'El navegador ha bloqueado la ventana emergente'
	},
	'auth/popup-closed-by-user': {
		code: 36,
		text: 'El usuario cerró la ventana emergente sin completar el inicio de sesión en el proveedor'
	},
	'auth/unauthorized-domain': {
		code: 37,
		text: 'El dominio de la aplicación no está autorizado para realizar operaciones'
	},
	'auth/invalid-user-token': {
		code: 38,
		text: 'El usuario actual no fue identificado'
	},
	'auth/user-token-expired': {
		code: 39,
		text: 'El token del usuario actual ha caducado'
	},
	'auth/null-user': { code: 40, text: 'El usuario actual es nulo' },
	'auth/app-not-authorized': {
		code: 41,
		text: 'Aplicación no autorizada para autenticarse con la clave dada'
	},
	'auth/invalid-api-key': {
		code: 42,
		text: 'La clave API proporcionada no es válida'
	},
	'auth/network-request-failed': {
		code: 43,
		text: 'Error al conectarse a la red'
	},
	'auth/requires-recent-login': {
		code: 44,
		text: 'El último tiempo de acceso del usuario no cumple con el límite de seguridad'
	},
	'auth/too-many-requests': {
		code: 45,
		text: 'Las solicitudes se bloquearon debido a una actividad inusual. Vuelva a intentarlo después de un tiempo'
	},
	'auth/web-storage-unsupported': {
		code: 46,
		text: 'El navegador no es compatible con el almacenamiento o si el usuario ha deshabilitado esta función'
	},
	'auth/invalid-claims': {
		code: 47,
		text: 'Los atributos de registro personalizados no son válidos'
	},
	'auth/claims-too-large': {
		code: 48,
		text: 'El tamaño de la solicitud excede el tamaño máximo permitido de 1 Megabyte'
	},
	'auth/id-token-expired': { code: 49, text: 'El token informado ha caducado' },
	'auth/id-token-revoked': { code: 50, text: 'El token informado ha caducado' },
	'auth/invalid-argument': {
		code: 51,
		text: 'Se proporcionó un argumento no válido a un método'
	},
	'auth/invalid-creation-time': {
		code: 52,
		text: 'La hora de creación debe ser una fecha UTC válida'
	},
	'auth/invalid-disabled-field': {
		code: 53,
		text: 'La propiedad para el usuario deshabilitado no es válida'
	},
	'auth/invalid-display-name': {
		code: 54,
		text: 'El nombre de usuario no es válido'
	},
	'auth/invalid-email-verified': {
		code: 55,
		text: 'El correo electrónico no es válido'
	},
	'auth/invalid-hash-algorithm': {
		code: 56,
		text: 'El algoritmo HASH no es compatible con la criptografía'
	},
	'auth/invalid-hash-block-size': {
		code: 57,
		text: 'El tamaño del bloque HASH no es válido'
	},
	'auth/invalid-hash-derived-key-length': {
		code: 58,
		text: 'El tamaño de la clave derivada de HASH no es válido'
	},
	'auth/invalid-hash-key': {
		code: 59,
		text: 'La clave HASH debe tener un búfer de bytes válido'
	},
	'auth/invalid-hash-memory-cost': {
		code: 60,
		text: 'El costo de la memoria HASH no es válido'
	},
	'auth/invalid-hash-parallelization': {
		code: 61,
		text: 'La carga paralela HASH no es válida'
	},
	'auth/invalid-hash-rounds': {
		code: 62,
		text: 'El redondeo HASH no es válido'
	},
	'auth/invalid-hash-salt-separator': {
		code: 63,
		text: 'El campo separador SALT del algoritmo de generación HASH debe ser un búfer de bytes válido'
	},
	'auth/invalid-id-token': {
		code: 64,
		text: 'El código de token ingresado no es válido'
	},
	'auth/invalid-last-sign-in-time': {
		code: 65,
		text: 'La última hora de inicio de sesión debe ser una fecha UTC válida'
	},
	'auth/invalid-page-token': {
		code: 66,
		text: 'La siguiente URL proporcionada en la solicitud no es válida'
	},
	'auth/invalid-password': {
		code: 67,
		text: 'La contraseña no es válida, debe tener al menos 6 caracteres de longitud'
	},
	'auth/invalid-password-hash': {
		code: 68,
		text: 'La contraseña HASH no es válida'
	},
	'auth/invalid-password-salt': {
		code: 69,
		text: 'La contraseña SALT no es válida'
	},
	'auth/invalid-photo-url': {
		code: 70,
		text: 'La URL de la foto del usuario no es válida'
	},
	'auth/invalid-provider-id': {
		code: 71,
		text: 'El identificador del proveedor no es compatible'
	},
	'auth/invalid-session-cookie-duration': {
		code: 72,
		text: 'La duración de la COOKIE de la sesión debe ser un número válido en milisegundos, entre 5 minutos y 2 semanas'
	},
	'auth/invalid-uid': {
		code: 73,
		text: 'El identificador proporcionado debe tener un máximo de 128 caracteres'
	},
	'auth/invalid-user-import': {
		code: 74,
		text: 'El registro de usuario a importar no es válido'
	},
	'auth/invalid-provider-data': {
		code: 75,
		text: 'El proveedor de datos no es válido'
	},
	'auth/maximum-user-count-exceeded': {
		code: 76,
		text: 'Se ha excedido el número máximo permitido de usuarios a importar'
	},
	'auth/missing-hash-algorithm': {
		code: 77,
		text: 'Es necesario proporcionar el algoritmo de generación HASH y sus parámetros para importar usuarios'
	},
	'auth/missing-uid': {
		code: 78,
		text: 'Se requiere un identificador para la operación actual'
	},
	'auth/reserved-claims': {
		code: 79,
		text: 'Una o más propiedades personalizadas proporcionaron palabras reservadas usadas'
	},
	'auth/session-cookie-revoked': {
		code: 80,
		text: 'La sesión COOKIE ha expirado'
	},
	'auth/uid-alread-exists': {
		code: 81,
		text: 'El identificador proporcionado ya está en uso'
	},
	'auth/email-already-exists': {
		code: 82,
		text: 'El correo electrónico proporcionado ya está en uso'
	},
	'auth/phone-number-already-exists': {
		code: 83,
		text: 'El teléfono proporcionado ya está en uso'
	},
	'auth/project-not-found': { code: 84, text: 'No se encontraron proyectos' },
	'auth/insufficient-permission': {
		code: 85,
		text: 'La credencial utilizada no tiene acceso al recurso solicitado'
	},
	'auth/internal-error': {
		code: 86,
		text: 'El servidor de autenticación encontró un error inesperado al intentar procesar la solicitud'
	}
}

export const fbErrorToCode = (error: {
	code: string
	message: string
}): {
	code: number
	text: string
} => {
	const findError = authErrorsList[error.code]
	if (!findError) return { code: -1, text: 'Ocurrió un error inesperado' }
	return { code: findError?.code, text: findError?.text }
}
