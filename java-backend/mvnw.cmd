@echo off
setlocal
cd /d %~dp0
set MAVEN_PROJECTBASEDIR=%CD%
set MVNW_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
set JAVA_EXE=java
if defined JAVA_HOME (
  set JAVA_EXE=%JAVA_HOME%\bin\java.exe
)
"%JAVA_EXE%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp "%MVNW_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
if errorlevel 1 exit /b %errorlevel%
