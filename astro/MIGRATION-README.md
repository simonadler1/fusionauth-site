# Docs Migration
Here is what you need to know for migrating docs

### Ground rules
- this is living doc, keep an eye on it
- everything lyle says goes...

### handy dandy regexes
links:
```regex
\* link:(.*)\[(.*)\]
```
to:
```regex
[$2]($1)
```

## TODOs
- [ ] move content/quickstarts to content/docs/quickstarts
- [ ] do a sweep for dead links, basically anything that is `/docs/v1/*`
- [ ] investigate using https://github.com/s0/remark-code-frontmatter to handle things like
```asciidoc
[source,title=Start FusionAuth]
----
# Start Services
<FUSIONAUTH_HOME>/fusionauth/bin/startup.sh
----
```
