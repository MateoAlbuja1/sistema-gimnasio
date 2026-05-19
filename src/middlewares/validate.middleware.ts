import { Request, Response, NextFunction } from 'express'; // Importa los tipos de Express para tipar la petición, respuesta y función next
import { AnyZodObject, ZodError } from 'zod'; // Importa el tipo de esquema genérico de Zod y la clase de error de validación

export const validateTask = (schema: AnyZodObject) => { // Define y exporta una función que recibe un esquema de Zod como parámetro
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => { // Retorna un middleware asíncrono con los parámetros estándar de Express
        try { // Inicia el bloque de intento donde se ejecuta la validación
            // Intenta validar lo que viene en el cuerpo de la petición
            schema.parse(req.body); // Valida que el cuerpo de la petición cumpla con la estructura definida en el esquema
            next(); // Si la validación pasa, llama a next() para continuar al siguiente middleware o controlador
        } catch (error) { // Captura cualquier error que ocurra durante la validación
            if (error instanceof ZodError) { // Verifica si el error es específicamente un error de validación de Zod
                res.status(400).json({ // Envía una respuesta HTTP 400 (Bad Request) con formato JSON
                    status: "error_validacion", // Campo que indica el tipo de error ocurrido
                    errors: error.errors.map(err => ({ // Recorre el array de errores de Zod y los transforma en un formato personalizado
                        campo: err.path[0], // Extrae el nombre del campo que falló la validación
                        mensaje: err.message // Extrae el mensaje descriptivo del error de ese campo
                    }))
                });
                return; // Termina la ejecución del middleware para no llamar a next() después de responder
            }
            next(error); // Si el error no es de Zod, lo pasa al middleware de manejo de errores global
        }
    };
};