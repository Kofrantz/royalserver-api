# Usa una imagen base mínima de Alpine Linux
FROM eclipse-temurin:21

# Verifica la instalación de Java
RUN java -version

# Establece el directorio de trabajo en el contenedor
WORKDIR /minecraft

# Acepta automáticamente el EULA de Minecraft
RUN echo "eula=true" > eula.txt

# Expone el puerto por defecto de Minecraft
EXPOSE 25565

# Evita iniciar el servidor automáticamente, dejando el contenedor en un estado listo
CMD ["sleep", "infinity"]
