<?php
	
	//Esse arquivo simula uma consulta no banco de dados e retorna um JSON
	
	
	$atividades = array
	(
		'Concluido'   => '2000',
		'Concluido_Vencido' => '1732',
		'Iniciado'   => '800',
		'Iniciado_Vencido'     => '250', 
		'Pendente'   => '1320',
		'Vencido'     => '565'
	);
	
	//Colocando o Array em formato JSON e retornando para o AJAX
	echo json_encode($atividades);	

?>