NAME=smart-search

all: $(NAME)

$(NAME): lint test build

lint:
	@./node_modules/.bin/jshint lib/$(NAME).js test \
	&& echo "\033[32m    ✓  jshint OK! \033[0m"

test:
	@./node_modules/.bin/mocha

build:
	@./node_modules/.bin/uglifyjs lib/$(NAME).js > lib/$(NAME)-min.js

clean:
	rm lib/$(NAME)-min.js

re: clean all

.PHONY: all lint test build clean re