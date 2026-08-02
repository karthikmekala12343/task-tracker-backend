@echo off
set MAVEN_PROJECTBASEDIR=%~dp0
set MVNW_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
java -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp "%MVNW_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
