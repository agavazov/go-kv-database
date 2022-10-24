## Build
FROM golang:1.19 AS build_base

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

#COPY *.go ./
COPY . ./

RUN go build -o /docker-gs-ping

## Deploy
FROM gcr.io/distroless/base-debian10

WORKDIR /

COPY --from=build_base /docker-gs-ping /docker-gs-ping

EXPOSE 80

USER nonroot:nonroot

ENTRYPOINT ["/docker-gs-ping"]
