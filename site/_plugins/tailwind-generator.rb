require 'digest'
require 'fileutils'

Jekyll::Hooks.register :site, :post_write do |site|
  puts("Generating Tailwind CSS")
  system("tailwindcss -i site/assets/css/style.css -o #{site.dest}/assets/css/style.css")
end