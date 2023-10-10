FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY ./Sources/SpecialDelete.NumberGame/*.csproj ./Sources/SpecialDelete.NumberGame/
COPY ./Sources/SpecialDelete.RecoverByBetId/*.csproj ./Sources/SpecialDelete.RecoverByBetId/
COPY ./Sources/SpecialDelete.UploadBatchMessage/*.csproj ./Sources/SpecialDelete.UploadBatchMessage/
COPY ./Sources/SpecialDelete.VirtualSports/*.csproj ./Sources/SpecialDelete.VirtualSports/
COPY ./Sources/TicketVoidingSystem/*.csproj ./Sources/TicketVoidingSystem/
COPY ./Sources/TicketVoidingSystem.ABExceptionList/*.csproj ./Sources/TicketVoidingSystem.ABExceptionList/
COPY ./Sources/TicketVoidingSystem.ManageRequest/*.csproj ./Sources/TicketVoidingSystem.ManageRequest/
COPY ./Sources/TicketVoidingSystem.ManageVoidServices/*.csproj ./Sources/TicketVoidingSystem.ManageVoidServices/
COPY ./Sources/TicketVoidingSystem.MarkTickets/*.csproj ./Sources/TicketVoidingSystem.MarkTickets/
COPY ./Sources/TicketVoidingSystem.SharedApi/*.csproj ./Sources/TicketVoidingSystem.SharedApi/
COPY ./Sources/TicketVoidingSystem.SimpleDataApi/*.csproj ./Sources/TicketVoidingSystem.SimpleDataApi/
COPY ./Sources/TicketVoidingSystem.TicketListing/*.csproj ./Sources/TicketVoidingSystem.TicketListing/
COPY ./Sources/TicketVoidingSystem.VoidSingleBet/*.csproj ./Sources/TicketVoidingSystem.VoidSingleBet/
COPY ./TicketVoidingSystem.Website/*.csproj ./TicketVoidingSystem.Website/


RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
 dotnet restore TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj

COPY ./Sources/. ./Sources
COPY ./TicketVoidingSystem.Website/. ./TicketVoidingSystem.Website

WORKDIR /src/TicketVoidingSystem.Website
RUN --mount=type=cache,target=/root/.nuget/packages \
 dotnet publish -c release -o /app --no-restore

FROM hub.nexdev.net/base/dotnet/core/aspnet:7.0-alpine AS base

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