# scraper

## Running the scraper

```bash
bun install
```

To run:

```bash
bun start
```

## Description

This project is a scraper for the [Kampus.hr](https://kampus.hr) platform. It is used to gather data about colleges, programs, subjects and professors.

## How it works

The scraper is built using [Puppeteer](https://pptr.dev) and [Bun](https://bun.sh). Every college has its own driver that is responsible for scraping the data. The drivers are located in the `src/modules/driver` directory. Each driver outputs a the following data:

- Programs
- Professors
- Subjects

The data is linked together using the `externalLink` field.

The data is then saved to a JSON file in the `out` directory.

## CLI arguments

- `--college`: Selects the college to scrape.
- `--debug`: Enables debug mode - limits the number of pages scraped for each program.
- `--list`: Lists all colleges available for scraping.
