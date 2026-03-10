# PawLink Backend 🐾

The server-side engine for **PawLink** — a unified digital registry designed to keep pets safe through QR-coded identification and automated lost-and-found matching.

---

## Overview

This repository contains the RESTful API and core logic for the PawLink platform. It manages the lifecycle of a pet's "Digital Passport," handles secure owner authentication, and facilitates the connection between a found animal's QR tag and its owner's contact information.

## Project setup

```bash
# development
$ docker compose --profile dev up

# production
$ docker compose --profile prod up
```

## Database Setup

```bash
$ npx prisma db push
```
