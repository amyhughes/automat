addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.1")
addSbtPlugin("org.foundweekends.giter8" % "sbt-giter8-scaffold" % "0.11.0")
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.7.3")
addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.8")

libraryDependencies += "org.vafer" % "jdeb" % "1.3" artifacts (Artifact("jdeb", "jar", "jar"))