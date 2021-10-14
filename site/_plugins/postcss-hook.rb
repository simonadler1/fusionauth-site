Jekyll::Hooks.register :site, :post_write do |site|
  Jekyll.logger.info("Postcss:", "Compiling CSS")
  system("npx postcss site/assets/css/style.css -o _site/assets/css/style.css")
end
