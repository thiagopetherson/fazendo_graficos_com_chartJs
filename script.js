window.onload = function()
{	

	let pegar =	pegarStatusAtividades(); //Chamamos a função pegarStatusAtividades (que faz a requisição AJAX)
	
	
	//Função que faz a requisição e faz a consulta no banco através do arquivo php
	function pegarStatusAtividades()
	{
		//Pegando o objeto XHTTORequest (que é o objeto que faz requisições para o servidor) de acordo com o navegador
		let ajax = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft,XMLHTTP");
		
		
		//Consulta ao arquivo (que simula uma consulta no banco e retorna um JSON) que retorna os dados que preencherão os gráficos
		ajax.open('POST','pesquisa-status-atividade.php');
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		ajax.send();
		
		ajax.onload = function()
		{		
			
			//Verificamos se deu tudo certo na requisição AJAX
			if(ajax.readyState == 4 && ajax.status == 200)
			{					
				let dadosretornojson = ajax.responseText; //O responseText é o retorno do AJAX (que é os dados que veio do arquivo do open())
				let lista = JSON.parse(dadosretornojson); //O JSON.parse transforma um JSON
				let retorno_configura_dados = configuraDados(lista);//Passamos o objeto citado acima como parâmetro para a função configuraDados
				
				//Passamos o retorno da função configuraDados como parâmetro para a função montaGráficos
				montaGraficos(retorno_configura_dados);							
			}
			else
			{
				alert("Falha no carregamento do gráfico");
			}
			
		};			
		
		
	}
	
	//Função que determina e passa os valores para a função que gera o gráfico
	function montaGraficos(data)
	{
		
		 //atividades_status
		dataSetArgumentos = [];
		let canvas_status = document.getElementById('canvas_status_atividades').getContext('2d'); //Elemento HTML do gráfico
		backgroundBarras = ['#3AB43A','#B4693A','#3E9CE4','#CAC02F','#1B2178','#E9300B']; //Aqui, colocamos as cores para cada uma das barras. Se o retorno viesse com mais dados, do que o retornado nesse código, teríamos que inserir mais cores ali. Ou então, colocar uma só cor padrão.
		pDatasetStatusAtividades = config_dataset('Quantidade de Atividades: ', data.status_atividades, backgroundBarras, backgroundBarras); //O primeiro parâmetro é a legenda que aparece dentro da caixa que mostra os itens, o segundos são os valores das barras, o terceiro é a cor da barra, o quarto é a borda da leganda de dentro da caixa. 
		dataSetArgumentos.push(pDatasetStatusAtividades);
		gerarGrafico(canvas_status, "Status/Número de Atividades", data.status_labels, dataSetArgumentos, 'bar', 'Qtd:'); 
	}	
	
	//Função que gera o gráfico
	function gerarGrafico(pCanvas, pTitulo, plabels, pDatasets, pTipoInicial, p_tooltip_label)
	{			
		var myChart = new Chart(pCanvas, 
		{
			type: pTipoInicial,		 

			options: 
			{
				title: //Cofigurações do título
				{
					//fontColor: "purple", //Cor do título
					//display: true,
					//text: pTitulo,
				},
				tooltips: 
				{
					callbacks: 
					{	//Legenda interna de dentro da caixa que aparece quando clicamos na barra
						label: function(tooltipItem, data) 
						{
							var label = data.datasets[tooltipItem.datasetIndex].label || '';
							
							//Abaixo, nós formatamos a exibição dos dados de acordo com o tipo de dados que vamos exibir
							if(p_tooltip_label == "R$")
							{
								if (label) {
									label += ' ' + tooltipItem.yLabel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
								}
							}
							else if(p_tooltip_label == "Qtd:")
							{
								if (label) {
									label += " " + p_tooltip_label + tooltipItem.yLabel; 
								}
							}
							else
							{
								if (label) 
								{
									label += ' ' + Math.round(tooltipItem.yLabel * 100);
									label += ' %';
								}
							}

								//label += Math.round(tooltipItem.yLabel * 100) / 100;
							return label;
						}
					}
				},
				legend: 
				{
					labels: 
					{
						fontColor: "black", //Cor do subtítulo
						beginAtZero: true,
						fontSize: 18
					}
				},
				scales: 
				{
					yAxes: 
					[{
						ticks: 
						{
							fontColor: "black", //Cor da legenda da coluna do eixo Y
							beginAtZero: true,
							fontSize: 14,

							callback: function(value, index, values) 
							{
								if(p_tooltip_label == "R$")
								{
										 // if(parseInt(value) >= 1000){ Não estava servindo pois existem valores negativos, e estes não estavam sendo considerados pelo if, pois somente > 1000 então nada abaixo de zero poderia entrar.
										 if(value.toString().length >= 5){ //Se o número tiver 5 digitos ou mais, então ele é formatado de acordo.

											return 'R$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
										  } else {
											return 'R$' + value;
										  }
								}
								else if(p_tooltip_label == "Qtd:")
								{
									
										return " " + p_tooltip_label + value.toString();
									
								}
								else
								{
									return '%' + value * 100;
								}


							}
						}
					}],
				    xAxes: 
					[{
						ticks: 
						{
							fontColor: "black", //cor da legenda que fica embaixo do gráfico (de cada coluna)
							fontSize: 16
						}
					}]
				}


			},

			data: 
			{
				labels: plabels, //Passando as legendas
				datasets: pDatasets, //Valores, cores da barra...
				fill: false //Não sabemos o que é 
			}
			
		});
	}
	
	
	//Função que pega as legendas, os dados do gráfico, a cor de fundo e a borda
	function config_dataset(plabel, pData, pBackgroundColor, pBorderColor)
	{
				
		var objeto_dataset = 
		{
		backgroundColor: pBackgroundColor, //Cor das barras
		borderColor:  pBorderColor, //Cor da borda
		label: plabel, //Texto das legendas (que aparecem no popup quando passamos o mouse nas barras)
		data: pData //Os dados que preenchem as barras
		};		
		
		return objeto_dataset;
		
		//Existem diversos outros parâmetros que podemos utilizar no dataSet (como cor do hover, transparência, etc...). Na documentação do ChartJS mostra os outros parâmetros que podemso utilizar.
		
	}
	
	
	
	
	function configuraDados(dados)
	{ //separa o json em arrays individuais para cada data-set;
			
		let statusatividades = [];	
		let statuslabels = [];	

		Object.entries(dados).forEach(([key, value]) =>
		{	
				
			statuslabels.push(key); //Pegando as Labels (as legendas do gráfico)
			statusatividades.push(value); //Pegando os valores do gráfico (que são os valores das barras) 		
			
		});
		
		//Trasformamos esses dados acima em um objeto
		var objeto_labels_atividades = 
		{
			status_labels:statuslabels,
			status_atividades:statusatividades				
		}	
		
		//Retornamos o objeto
		return objeto_labels_atividades;
				
	}
	
	
	
	
}	
