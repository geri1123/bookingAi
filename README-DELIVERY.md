


cd /rruga/e/repos-it-tend
unzip -o booking-docker-cicd-files.zip -d .
rm -f libs/auth/tsconfig.tsbuildinfo   # nëse ekziston ende

cp .env.example .env
# plotëso .env me vlera reale/fake për test

docker compose build
docker compose up
```

Lexo `DEPLOYMENT.md` për listën e plotë të hapave (migrime DB, GitHub
Secrets/Environments, si funksionon CI/CD).
