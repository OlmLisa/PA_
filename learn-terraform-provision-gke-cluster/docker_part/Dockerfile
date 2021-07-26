FROM ethereum/client-go:v1.8.27

RUN apk update \
    && apk add bash curl coreutils

COPY genesis.json /geth/genesis.json
COPY password.txt /geth/password.txt
ADD keys /geth/keys

WORKDIR /
COPY ./common_start.sh /common_start.sh
COPY start.sh /start.sh
RUN chmod +x /start.sh
ENTRYPOINT [ "/start.sh" ]