# syntax=docker/dockerfile:1
# Base image: Microsoft .NET SDK 10.0 on Ubuntu (Jammy)
# Pin to a precise tag to ensure reproducible builds across contributors.
FROM mcr.microsoft.com/dotnet/sdk:10.0.100

# Install Node.js 22 (LTS) via NodeSource
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        git \
        gnupg \
        procps \
        ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Angular CLI globally — version pinned to match frontend/package.json devDependency
RUN npm install -g @angular/cli@22

# Create a non-root user (vscode) that matches the VS Code dev container convention
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update && apt-get install -y sudo \
    && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

USER $USERNAME
