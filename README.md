# Checkout files action [![Tests](https://github.com/Vendic/checkout-files-action/actions/workflows/tests.yml/badge.svg)](https://github.com/Vendic/checkout-files-action/actions/workflows/tests.yml)
Checkout one or multiple files from a repository. Insipred by [Bhacaz/checkout-files](https://github.com/Bhacaz/checkout-files).

### Usage
```yml
      - uses: Vendic/checkout-files-action@v1.0.0
        with:
          paths: |
            your
            files
          repo: ${{ github.repository }}
          token: ${{ secrets.GITHUB_TOKEN }}
          ref: 'main' # (optional) Default: the repository’s default branch.
```
