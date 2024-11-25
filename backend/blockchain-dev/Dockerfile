FROM debian:bookworm-slim AS base

RUN apt-get update -yq \
    && apt-get install -yq \
      pkg-config \
      openssl \
      libssl-dev \
      curl \
      git
WORKDIR /anvil

RUN ln -sf /bin/bash /bin/sh
RUN curl -L https://foundry.paradigm.xyz | bash
RUN source /root/.bashrc
RUN cat /root/.bashrc
RUN ls -all /root/.foundry/bin/
RUN /root/.foundry/bin/foundryup

COPY ./contracts/lib ./lib/
COPY ./contracts/script ./script/
COPY ./contracts/src ./src/
COPY ./contracts/foundry.toml ./
COPY ./backend/blockchain-dev/start-chain.bash ./

ENTRYPOINT ./start-chain.bash
