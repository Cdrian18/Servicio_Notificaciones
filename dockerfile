# Usa una imagen oficial de Node.js como imagen base
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de tu proyecto al contenedor
COPY . .

# Expone el puerto en el que corre tu aplicación
EXPOSE 3000

# Variable de entorno para configurar el puerto (opcional)
ENV PORT=3000

# Comando para correr tu aplicación
CMD ["node", "server.js"]
