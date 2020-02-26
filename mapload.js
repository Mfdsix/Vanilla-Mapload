Object.prototype.filepicker = function(config){
			// read configuration
			var type = (config.type) ? config.type : 'img';
			var thumbnail = (config.thumbnail) ? config.thumbnail : './img/img.jpg';
			var max = (config.max) ? config.max : 0;
			var allowed = (config.allowed) ? config.allowed : null;
			var files = (config.files) ? config.files : 1;
			var target = $(this).data("target");
			if(!target){
				alert("Please define target input name");
				$(this).html('<div class="mapload-notif">Please define target input name</div>');
				return;
			}
			// add image preview & input
			var multiple = (files == 1) ? '' : 'multiple=""';
			$(this).html('<img data-source="'+target+'" src="'+thumbnail+'" class="mapload-preview"><br><p data-source="'+target+'" class="mapload-filename">upload here</p>');
			$(this).after('<input type="file" class="mapload-input" name="'+target+'" '+multiple+'">');
			// handle on clik
			var input = $("input[name='"+target+"']");
			$("img.mapload-preview[data-source='"+target+"']").on("click", function(){
				input.click();
			});
			input.on("change", function(e){
				var selected = e.target.files;
				if(files == 1){
					var selected = selected[0];
					if(check_extension(selected.type, allowed)){
						show_preview(selected, type, target);
					}else{
						alert("Filetype not Allowed, only ["+allowed+"] allowed");
					}
				}else{
					if(files != 0 && selected.length > files){
						alert("Max file Allowed to upload is "+files);
						$("input[name='"+target+"']").val("");
					}else{
						var passed = 0;
						for(var i = 0; i < selected.length; i++){
							if(check_extension(selected[i].type, allowed)){
								passed++;
							}
						}
						if(passed == selected.length){
							$(".mapload-filename[data-source='"+target+"']").html(selected.length+" files selected");
							show_preview(selected, type, target);
						}else if(passed == 0){
							alert("Filetype not Allowed, only ["+allowed+"] allowed");
						}else{
							$(".mapload-filename[data-source='"+target+"']").html(passed+" files selected");
							alert((selected.length-passed)+" Failed");
							show_preview(selected, type, target);
						}
					}
				}
			});
		}

		function check_extension(filetype, allowed){
			var type = filetype.split("/")[1];
			var split = allowed.split(",");
			var passed = false
			split.forEach((v)=>{
				if(type == v){
					passed = true;
				}
			});
			return passed;
		}

		function show_preview(file, type, source){
			if(type == 'img'){
				var reader = new FileReader();
				reader.onload = function(e) {
					$('img.mapload-preview[data-source="'+source+'"]').attr('src', e.target.result);
				}
				reader.readAsDataURL(file);
				$(".mapload-filename[data-source='"+source+"']").html(file.name);
			}else{
				$('img.mapload-preview[data-source="'+source+'"]').attr('src', './img/doc.png');
			}
		}