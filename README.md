# Sectool Github Action

This GitHub Action installs and runs the `sectool`.

## Usage

To use this action in your workflow, add the following step:

```yaml
steps:
  - name: Install SecTool
    uses: a13labs/setup-sectool@v1
    with:
      version: 0.0.3

  - name: Run sectool
    run: sectool exec terraform init
