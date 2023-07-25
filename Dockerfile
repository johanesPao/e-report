# Menggunakan Docker Image Node.js official
FROM node:slim

# Install Rust
RUN apt update \
&& apt upgrade -y \
&& apt install curl -y \
&& curl https://sh.rustup.rs -sSf | sh -s -- -y \
&& apt install build-essential \
    pkg-config -y

# Setting environment variabel Rust
ENV PATH="/root/.cargo/bin:$PATH"

# Setting folder kerja dalam kontainer
WORKDIR /e-report

# Copy package.json dan package-lock.json ke dalam kontainer
COPY package*.json ./

# Install dependencies project NPM
RUN npm install

# Copy semua file dan folder ke dalam folder kerja kontainer
COPY . .

