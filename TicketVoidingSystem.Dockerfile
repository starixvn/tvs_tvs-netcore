FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY ./Sources/TicketVoidingSystem ./Sources/TicketVoidingSystem
COPY ./Sources/TicketVoidingSystem.ABExceptionList ./Sources/TicketVoidingSystem.ABExceptionList
COPY ./Sources/TicketVoidingSystem.ManageVoidServices ./Sources/TicketVoidingSystem.ManageVoidServices
COPY ./Sources/TicketVoidingSystem.SharedApi ./Sources/TicketVoidingSystem.SharedApi
COPY ./TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj ./TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj

WORKDIR /src/TicketVoidingSystem.Website
RUN dotnet nuget add source http://nuget.nexdev.net/api/v2
RUN dotnet restore -v n

COPY ./TicketVoidingSystem.Website .

RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:7.0 AS base

# Don’t run as root
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app
USER dotnetuser
#

WORKDIR /app
COPY --from=builder /app .
ENV TZ="America/La_Paz"

ENTRYPOINT ["dotnet", "TicketVoidingSystem.Website.dll"]