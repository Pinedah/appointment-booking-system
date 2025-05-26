-- Tabla para manejar la autenticación de usuarios
CREATE TABLE IF NOT EXISTS public."Auth" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_paciente INTEGER,
    id_medico INTEGER,
    role VARCHAR(20) NOT NULL DEFAULT 'patient',
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auth_paciente_fk FOREIGN KEY (id_paciente) REFERENCES public.pacientes(id_paciente) ON DELETE CASCADE,
    CONSTRAINT auth_medico_fk FOREIGN KEY (id_medico) REFERENCES public.medico(id_medico) ON DELETE CASCADE,
    CONSTRAINT auth_user_unique CHECK (
        (id_paciente IS NOT NULL AND id_medico IS NULL) OR 
        (id_paciente IS NULL AND id_medico IS NOT NULL)
    )
);
