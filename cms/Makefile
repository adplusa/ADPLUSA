.PHONY: help setup dev prod down logs clean restart rebuild migrate backup restore

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup - create .env files
	@chmod +x setup.sh
	@./setup.sh

dev: ## Start development environment
	docker-compose up

dev-d: ## Start development environment in detached mode
	docker-compose up -d

prod: ## Start production environment
	docker-compose -f docker-compose.prod.yml up -d

down: ## Stop all services
	docker-compose down

down-prod: ## Stop production services
	docker-compose -f docker-compose.prod.yml down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

logs-mongodb: ## View MongoDB logs
	docker-compose logs -f mongodb

clean: ## Stop services and remove volumes (WARNING: deletes database)
	docker-compose down -v

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend service
	docker-compose restart backend

restart-frontend: ## Restart frontend service
	docker-compose restart frontend

rebuild: ## Rebuild and restart all services
	docker-compose up --build

rebuild-backend: ## Rebuild backend service
	docker-compose up --build backend

rebuild-frontend: ## Rebuild frontend service
	docker-compose up --build frontend

migrate: ## Run database migration
	docker-compose exec backend npm run migrate

backup: ## Backup MongoDB database
	@mkdir -p ./backups
	docker-compose exec mongodb mongodump --out=/data/backup
	docker cp architect-cms-mongodb:/data/backup ./backups/backup-$$(date +%Y%m%d-%H%M%S)
	@echo "Backup created in ./backups/"

restore: ## Restore MongoDB database (usage: make restore BACKUP=./backups/backup-20240101-120000)
	@if [ -z "$(BACKUP)" ]; then \
		echo "Error: Please specify BACKUP path. Usage: make restore BACKUP=./backups/backup-20240101-120000"; \
		exit 1; \
	fi
	docker cp $(BACKUP) architect-cms-mongodb:/data/restore
	docker-compose exec mongodb mongorestore /data/restore
	@echo "Database restored from $(BACKUP)"

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

shell-mongodb: ## Open MongoDB shell
	docker-compose exec mongodb mongosh architect-cms

ps: ## Show running containers
	docker-compose ps

stats: ## Show container resource usage
	docker stats architect-cms-backend architect-cms-frontend architect-cms-mongodb
