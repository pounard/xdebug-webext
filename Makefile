
DEST=xdebug-webext.xpi
GENERATED=api.js background.js popup.js
FILES=dist/ pages/ icons/ _locales/ manifest.json popup.*

all: build zip

install:
	yarn install --dev

clean:
	rm $(DEST) $(GENERATED)

build:
	./node_modules/.bin/webpack

zip:
	zip -r $(DEST) $(FILES)
