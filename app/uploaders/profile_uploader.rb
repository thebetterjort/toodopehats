# encoding: utf-8

class ProfileUploader < ImageUploader

  version :curator_thumb do
    process resize_to_limit: [1200,630]
    
  end

end
