ARG CI_REGISTRY_IMAGE
FROM $CI_REGISTRY_IMAGE:builder AS deps
RUN mkdir -p /src/packages

FROM hub.nexdev.net/base/dotnet/core/sdk:9.0-alpine AS builder

ENV NUGET_PACKAGES=/src/packages
COPY --from=deps $NUGET_PACKAGES/. $NUGET_PACKAGES/

WORKDIR /src

COPY ./Sources/SpecialDelete.CashOutTransaction/*.csproj ./Sources/SpecialDelete.CashOutTransaction/
COPY ./Sources/SpecialDelete.NumberGame/*.csproj ./Sources/SpecialDelete.NumberGame/
COPY ./Sources/SpecialDelete.RecoverBet/*.csproj ./Sources/SpecialDelete.RecoverBet/
COPY ./Sources/SpecialDelete.RecoverByBetId/*.csproj ./Sources/SpecialDelete.RecoverByBetId/
COPY ./Sources/SpecialDelete.RecoverParlayBet/*.csproj ./Sources/SpecialDelete.RecoverParlayBet/
COPY ./Sources/SpecialDelete.UploadBatchMessage/*.csproj ./Sources/SpecialDelete.UploadBatchMessage/
COPY ./Sources/SpecialDelete.VirtualSports/*.csproj ./Sources/SpecialDelete.VirtualSports/
COPY ./Sources/SpecialDelete.VoidByBetId/*.csproj ./Sources/SpecialDelete.VoidByBetId/
COPY ./Sources/SpecialDelete.VoidByCurrency/*.csproj ./Sources/SpecialDelete.VoidByCurrency/
COPY ./Sources/TicketVoidingSystem/*.csproj ./Sources/TicketVoidingSystem/
COPY ./Sources/TicketVoidingSystem.ABExceptionList/*.csproj ./Sources/TicketVoidingSystem.ABExceptionList/
COPY ./Sources/TicketVoidingSystem.ManageRequest/*.csproj ./Sources/TicketVoidingSystem.ManageRequest/
COPY ./Sources/TicketVoidingSystem.ManageVoidServices/*.csproj ./Sources/TicketVoidingSystem.ManageVoidServices/
COPY ./Sources/TicketVoidingSystem.MarkTickets/*.csproj ./Sources/TicketVoidingSystem.MarkTickets/
COPY ./Sources/TicketVoidingSystem.SharedApi/*.csproj ./Sources/TicketVoidingSystem.SharedApi/
COPY ./Sources/TicketVoidingSystem.TicketListing/*.csproj ./Sources/TicketVoidingSystem.TicketListing/
COPY ./Sources/TicketVoidingSystem.VoidSingleBet/*.csproj ./Sources/TicketVoidingSystem.VoidSingleBet/
COPY ./TicketVoidingSystem.Website/*.csproj ./TicketVoidingSystem.Website/

# restore
RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore -v n -r linux-x64 TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj

 # publish
COPY ./Sources/. ./Sources
COPY ./TicketVoidingSystem.Website/. ./TicketVoidingSystem.Website

WORKDIR /src/TicketVoidingSystem.Website

RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:9.0-alpine AS base

# Don’t run as root
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app && chown -R dotnetuser /tmp
USER dotnetuser
#

WORKDIR /app
COPY --from=builder /app .
ENV TZ="America/La_Paz"
ENV COMPlus_EnableDiagnostics=0

ENTRYPOINT ["dotnet", "TicketVoidingSystem.Website.dll"]