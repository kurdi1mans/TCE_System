<?php
	
	class GarbageCollector
	{
		public function deleteOldDownloadFiles()
		{
			foreach (glob("Exported*") as $file)
			{
				if (filemtime($file) < time() - 86400)
				{
					unlink($file);
				}
			}
		}
	}
?>