# encoding: utf-8

class ProjectUploader < ImageUploader

  version :project_thumb
  version :project_thumb_small
  version :project_thumb_large
  version :project_thumb_facebook

  def store_dir
    "uploads/project/#{mounted_as}/#{model.id}"
  end

  version :project_thumb do
    process resize_to_fill: [220,172]
    
  end

  version :project_thumb_small, from_version: :project_thumb do
    process resize_to_fill: [85,67]
    
  end

  version :project_thumb_large do
    process resize_to_fill: [600,340]
    
  end

  #facebook requires a minimum thumb size
  version :project_thumb_facebook do
    process resize_to_fill: [512,400]
   
  end

end
