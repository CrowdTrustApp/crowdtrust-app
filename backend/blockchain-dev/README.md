# Blockchain Test

Tools for running foundry/anvil in a development or CI environment.

**Docker**

```bash
docker build -t blockchain-dev -f backend/blockchain-dev/Dockerfile .

docker run -p 8545:8545 blockchain-dev
```
