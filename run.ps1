$ErrorActionPreference = 'Stop'

Push-Location -LiteralPath $PSScriptRoot
try {
    & node scripts/package-demo.mjs
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    & java -jar target/spring_bobba-0.0.1-SNAPSHOT.jar --spring.profiles.active=demo @args
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
