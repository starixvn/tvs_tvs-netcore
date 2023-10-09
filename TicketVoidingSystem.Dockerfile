FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY ./Sources/SpecialDelete.UploadBatchMessage ./Sources/SpecialDelete.UploadBatchMessage
COPY ./Sources/SpecialDelete.VirtualSports ./Sources/SpecialDelete.VirtualSports
COPY ./Sources/SpecialDelete.RecoverByBetId ./Sources/SpecialDelete.RecoverByBetId
COPY ./Sources/TicketVoidingSystem ./Sources/TicketVoidingSystem
COPY ./Sources/TicketVoidingSystem.ABExceptionList ./Sources/TicketVoidingSystem.ABExceptionList
COPY ./Sources/TicketVoidingSystem.ManageVoidServices ./Sources/TicketVoidingSystem.ManageVoidServices
COPY ./Sources/TicketVoidingSystem.SharedApi ./Sources/TicketVoidingSystem.SharedApi
COPY ./Sources/TicketVoidingSystem.MarkTickets ./Sources/TicketVoidingSystem.MarkTickets
COPY ./Sources/TicketVoidingSystem.TicketListing ./Sources/TicketVoidingSystem.TicketListing
COPY ./Sources/TicketVoidingSystem.SimpleDataApi ./Sources/TicketVoidingSystem.SimpleDataApi
COPY ./Sources/TicketVoidingSystem.VoidSingleBet ./Sources/TicketVoidingSystem.VoidSingleBet
COPY ./Sources/TicketVoidingSystem.ManageRequest ./Sources/TicketVoidingSystem.ManageRequest
COPY ./TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj ./TicketVoidingSystem.Website/TicketVoidingSystem.Website.csproj

WORKDIR /src/TicketVoidingSystem.Website
RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
 dotnet restore -v n

COPY ./TicketVoidingSystem.Website .

RUN --mount=type=cache,target=/root/.nuget/packages \
 dotnet publish -r linux-x64 --self-contained false -c Release -o /app 

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