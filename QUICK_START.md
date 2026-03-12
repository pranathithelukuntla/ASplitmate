# Quick Start Guide

## Option 1: Install Maven (Recommended)

1. **Download Maven**: https://maven.apache.org/download.cgi
   - Download `apache-maven-3.9.x-bin.zip`
   - Extract to `C:\Program Files\Apache\maven` (or your preferred location)

2. **Add to PATH**:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files\Apache\maven\bin` to your PATH
   - Restart terminal

3. **Verify**:
   ```powershell
   mvn --version
   ```

4. **Build and run**:
   ```powershell
   mvn clean install
   mvn spring-boot:run
   ```

## Option 2: Use IDE with Built-in Maven

**IntelliJ IDEA** or **Eclipse** have Maven built-in:
- Open the project in your IDE
- Right-click `pom.xml` → Run Maven → Goals: `clean install`
- Run `SplitMateApplication.java` directly

## Option 3: Download Pre-built Maven Wrapper

If you have Git Bash or WSL, you can use:

```bash
# Download official Maven wrapper
curl -L https://github.com/takari/maven-wrapper/archive/maven-wrapper-0.5.6.tar.gz | tar xz
mv maven-wrapper-0.5.6/mvnw* .
chmod +x mvnw
```

Then use: `./mvnw clean install`

## Current Status

✅ Java 25 is installed  
✅ Maven Wrapper is set up and working  
✅ Project compiles successfully  

**You can now use**: `.\mvnw.cmd clean install` and `.\mvnw.cmd spring-boot:run`

**Note**: Make sure JAVA_HOME is set to your JDK path (e.g., `C:\Program Files\Java\jdk-25`).  
The wrapper will auto-detect it, but setting it explicitly is recommended.
