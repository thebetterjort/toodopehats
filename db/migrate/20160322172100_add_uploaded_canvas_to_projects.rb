class AddUploadedCanvasToProjects < ActiveRecord::Migration
  def change
  	 add_column :projects, :canvas_image, :text
  end
end
