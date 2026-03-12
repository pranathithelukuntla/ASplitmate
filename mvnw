#!/bin/sh
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# ----------------------------------------------------------------------------
# Maven Start Up Batch script
#
# Required ENV vars:
# JAVA_HOME - location of a JDK home dir
#
# Optional ENV vars
# M2_HOME - location of maven2's installed home dir
# MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
# MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
# MAVEN_OPTS - parameters passed to the Java VM when running Maven
#     e.g. to debug Maven itself, use
# set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
# MAVEN_SKIP_RC - flag to disable loading of mavenrc files
# ----------------------------------------------------------------------------

if [ -z "" ] ; then

  if [ -f /etc/mavenrc ] ; then
    . /etc/mavenrc
  fi

  if [ -f "C:\Users\TELUKUNTLA/.mavenrc" ] ; then
    . "C:\Users\TELUKUNTLA/.mavenrc"
  fi

fi

# OS specific support.  \ _must_ be set to either true or false.
cygwin=false;
darwin=false;
mingw=false
case "uname" in
  CYGWIN*) cygwin=true ;;
  MINGW*) mingw=true;;
  Darwin*) darwin=true
    # Use /usr/libexec/java_home if available, otherwise fall back to /Library/Java/Home
    # See https://developer.apple.com/library/mac/qa/qa1170/_index.html
    if [ -z "" ]; then
      if [ -x "/usr/libexec/java_home" ]; then
        export JAVA_HOME="/usr/libexec/java_home"
      else
        export JAVA_HOME="/Library/Java/Home"
      fi
    fi
    ;;
esac

if [ -z "" ] ; then
  if [ -r /etc/gentoo-release ] ; then
    JAVA_HOME=java-config --jre-home
  fi
fi

if [ -z "" ] ; then
  ## resolve links - $0 may be a link
  PRG="which """

  # need this for relative symlinks
  while [ -h "" ] ; do
    ls=ls -ld ""
    link=expr "" : '.*-> \(.*\)$'
    if expr "" : '/.*' > /dev/null; then
      PRG=""
    else
      PRG="dirname ""/"
    fi
  done

  saveddir=pwd

  M2_HOME=dirname ""/..

  # make it fully qualified
  M2_HOME=cd "" && pwd

  cd ""
  # echo Using m2 at \
fi

# For Cygwin, ensure paths are in UNIX format before anything is touched
if \ ; then
  [ -n "" ] &&
    M2_HOME=cygpath --unix ""
  [ -n "" ] &&
    JAVA_HOME=cygpath --unix ""
  [ -n "" ] &&
    CLASSPATH=cygpath --path --unix ""
fi

# For Mingw, ensure paths are in Windows format before anything is touched
if \ ; then
  [ -n "" ] &&
    M2_HOME="(cd ""; pwd)"
  [ -n "" ] &&
    JAVA_HOME="(cd ""; pwd)"
fi

if [ -z "" ]; then
  javaExecutable="which javac"
  if [ -n "" ] && ! [ "expr \"\\" : '\([^ ]*\)'" = "no" ]; then
    # readlink(1) is not available as standard on Solaris 10.
    readLink=which readlink
    if [ ! expr "" : '\([^ ]*\)' = "no" ]; then
      if  ; then
        javaHome="dirname \"\\""
        javaExecutable="cd \"\\" && pwd -P/javac"
      else
        javaExecutable="eadlink -f \"\\""
      fi
      javaHome="dirname \"\\""
      javaHome=expr "" : '\(.*\)/bin'
      JAVA_HOME=""
      export JAVA_HOME
    fi
  fi
fi

if [ -z "" ] ; then
  if [ -n ""  ] ; then
    if [ -x "/jre/sh/java" ] ; then
      # IBM's JDK on AIX uses strange locations for the executables
      JAVACMD="/jre/sh/java"
    else
      JAVACMD="/bin/java"
    fi
  else
    JAVACMD="which java"
  fi
fi

if [ ! -x "" ] ; then
  echo "Error: JAVA_HOME is not defined correctly." >&2
  echo "  We cannot execute \" >&2
  exit 1
fi

if [ -z "" ] ; then
  ## resolve links - $0 may be a link
  PRG="which """

  # need this for relative symlinks
  while [ -h "" ] ; do
    ls=ls -ld ""
    link=expr "" : '.*-> \(.*\)$'
    if expr "" : '/.*' > /dev/null; then
      PRG=""
    else
      PRG="dirname ""/"
    fi
  done

  saveddir=pwd

  MAVEN_PROJECTBASEDIR=dirname ""/..

  # make it fully qualified
  MAVEN_PROJECTBASEDIR=cd "" && pwd

  cd ""
fi

# Add default values
if [ -z "" ] ; then
    MAVEN_OPTS="-Xms256m -Xmx512m"
fi

WRAPPER_JAR="\/.mvn/wrapper/maven-wrapper.jar"
WRAPPER_LAUNCHER="org.apache.maven.wrapper.MavenWrapperMain"

if [ ! -e "\" ]; then
    echo "ERROR: Maven wrapper JAR not found: \"
    echo "Please run the setup script to download it."
    exit 1
fi

exec "\" \\
  \ \\
  -classpath "\" \\
  "-Dmaven.multiModuleProjectDirectory=\" \\
  \ \
