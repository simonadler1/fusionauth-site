require 'digest'
require 'fileutils'

module Jekyll
  class TailwindGenerator < Generator
    def generate(site)
      puts("Generating Tailwind CSS")
      system("tailwindcss -i site/assets/css/style.css -o #{site.dest}/assets/css/style.css")
    end
  end
end
