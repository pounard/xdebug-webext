
DEST=xdebug-webext.xpi
FILES=api.js background.js icons/ _locales/ manifest.json popup.*

all: zip

clean:
	rm $(DEST)

zip:
	zip -r $(DEST) $(FILES)
