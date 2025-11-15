#!/usr/bin/make

SHELL := /usr/bin/bash
.DEFAULT_GOAL: all
.EXIT_ON_ERROR:

SRCDIR_TOP := .
SRCDIR := src
ECMA_VERSION := es2024
NODE_VERSION := 24.11.1
NODE_VVERSION := v$(NODE_VERSION)
NVM_BIN := /home/pnoulis/.nvm/versions/node/$(NODE_VVERSION)/bin
NODE := $(NVM_BIN)/node
TS := $(NVM_BIN)/tsc
TSNODE := $(NVM_BIN)/ts-node
TSX := $(NVM_BIN)/tsx
ESBUILD := $(NVM_BIN)/esbuild
PRETTIER := $(NVM_BIN)/prettier
ESLINT := $(NVM_BIN)/eslint
NODEMON := $(NVM_BIN)/nodemon
SERVER := $(NVM_BIN)/http-server

PHONY: all

all: build

.PHONY: tsx
tsx:
	$(TSX) src/test.ts

PHONY: build
build:
	$(NODE) esbuild.config.js

PHONY: check
check:
	$(TS) --noEmit

PHONY: watch
watch:
	$(NODEMON) --watch $(SRCDIR) -e ts,tsx,js,jsx --exec "make build; make hmr"

PHONY: serve
serve:
	$(SERVER) --gzip -c -1

PHONY: hmr # hot module reload lol...
hmr:
	@echo TODO: hmr

PHONY: format
format:
	git diff --cached --name-only | while read -r file; do \
		case "$$file" in \
			*.json|*.js|*.ts|*.tsx|*.jsx|*.html) \
				$(PRETTIER) --config prettier.config.js --write "$$file"; \
		esac \
	done

PHONY: lint
lint:
	git diff --cached --name-only | while read -r file; do \
		case "$$file" in \
			*.js|*.ts|*.jsx|*.tsx) \
					$(ESLINT) --config eslint.config.js "$$file" ;; \
		esac \
	done
