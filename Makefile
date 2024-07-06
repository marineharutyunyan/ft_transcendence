all: up

build:
	docker-compose build

up:
	docker-compose up -d
	docker-compose logs -f

down:
	docker-compose down

migrations:
	docker-compose run pong sh -c "python manage.py makemigrations"

migrate:
	docker-compose run pong sh -c "python manage.py migrate"

# app:
# 	docker-compose run --rm backend sh -c "python manage.py startapp user_api"

prune: down
	rm -rf database/data
	docker system prune -f -a

fclean: down
	docker volume prune -f
	rm -rf database/data
	docker system prune -f -a

re: prune all

.PHONY: all build up down prune re fclean
