postgres-up:
	docker run --name postgres -p 5432:5432 \
	-e POSTGRES_PASSWORD=postgres \
	-e POSTGRES_USER=postgres \
	postgres

postgres-down:
	docker rm -f postgres