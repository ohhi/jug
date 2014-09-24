function parseBallCnt ()
{
	var balls_str = document.getElementById("balls").value;
	var balls = parseInt( balls_str );
	if ( balls_str && !balls && balls !== 0 )
	{
		document.getElementById("balls_err").innerHTML = "Invalid value. Must be a number.";
		res = false;
	}
	else if ( balls_str && balls < 0 )
	{
		document.getElementById("balls_err").innerHTML = "Amount of balls must be at least zero.";
		res = false;
	}
	else
	{
		document.getElementById("balls_err").innerHTML = "";
	}
	return balls;
}

function parseMaxT ( balls )
{
	if ( !balls )
	{
		document.getElementById("max_err").innerHTML = "Can't parse without ball count.";
		return null;
	}

	max_str = document.getElementById("max").value ;
	var max = parseInt( max_str );
	
	if ( max_str && !max && max !== 0 )
	{
		document.getElementById("max_err").innerHTML = "Invalid value. Must be a number.";
	}
	else if ( max_str && max < 0 )
	{
		document.getElementById("max_err").innerHTML = "Maximum height must be at least zero.";
	}
	else if ( max_str && max < balls )
	{
		document.getElementById("max_err").innerHTML = "Maximum height must be at least as big as the amount of balls.";
	}
	else
	{
		document.getElementById("max_err").innerHTML = "";
	}
	return max;
}

function parseSeql ()
{
	var seql_str = document.getElementById("seql").value;
	var seql = null;
	try
	{
		seql = JSON.parse( seql_str );
	}
	catch ( err ){}
	if ( (!seql && seql_str) || typeof seql !== "number" && ( !Array.isArray( seql) || seql.length !== 2 || !(seql[0] > 0) || !(seql[1] > 0)  ) )
	{
		document.getElementById("seql_err").innerHTML = "Invalid value. Must be a number or pair of numbers.";
	}
	else
	{
		if ( typeof seql === "number" )
		{
			seql = [seql, seql]
		}
		document.getElementById("seql_err").innerHTML = "";
	}
	return seql;
}

function parseWeights ( max_t )
{
	if ( !max_t )
	{
		document.getElementById("ws_err").innerHTML = "Can't parse without max height.";
		return null;
	}

	var ws_str = document.getElementById("ws").value;
	var ws = null;
	try
	{
		ws = JSON.parse( ws_str );
	}
	catch ( err ){}
	
	if ( !ws_str )
	{
		ws = [];
		for ( var i=0; i<=max_t; i++ )
		{
			ws.push(1);
		}
		document.getElementById("ws_err").innerHTML = "";
	}
	else if ( !Array.isArray( ws ) )
	{
		document.getElementById("ws_err").innerHTML = "Weights must be a vector of numbers.";
	}
	else
	{
		if ( ws.length !== max_t + 1 )
		{
			document.getElementById("ws_err").innerHTML = "Invalid quantity of weight values.";
		}
		else
		{
			var fl = true;
			for ( var i=0; i < ws.length; i++ )
			{
				if ( typeof ws[i] !== "number" )
				{
					document.getElementById("ws_err").innerHTML = "Invalid weight: " + ws[i];
					fl = false;
					break;
				}
				if ( typeof ws[i] <= 0 )
				{
					document.getElementById("ws_err").innerHTML = "Weights must be positive: " + ws[i];
					fl = false;
					break;
				}
			}
			if ( fl )
			{
				document.getElementById("ws_err").innerHTML = "";
			}
		}
	}
	return ws;
}

function validate ()
{
	var res = true;

	var ball_cnt = parseBallCnt();
	if ( !ball_cnt )
	{
		res = false;
	}
	
	var max_t = parseMaxT( ball_cnt );
	if ( !max_t )
	{
		res = false;
	}
	
	if ( !parseSeql() )
	{
		res = false;
	}

	if ( !parseWeights( max_t ) )
	{
		res = false;
	}

	var fl = true;
	var spos_str = document.getElementById("spos").value;
	if ( spos_str )
	{
		try
		{
			var spos = JSON.parse( spos_str );
		}
		catch ( err )
		{
			res = false;
		}

		if ( typeof spos === "undefined" ){}
		else if ( !Array.isArray( spos ) )
		{
			document.getElementById("spos_err").innerHTML = "Weights must be a vector of numbers.";
			res = false;
		}
		else
		{
			if ( spos.length !== max_t )
			{
				document.getElementById("spos_err").innerHTML = "Invalid quantity of values.";
				res = false;
			}
			else
			{
				var tot = 0;
				for ( var i=0; i < spos.length; i++ )
				{
					if ( spos[i] !== 1 && spos[i] !== 0 )
					{
						document.getElementById("spos_err").innerHTML = "Invalid value: " + spos[i];
						res = false;
						fl = false;
						break;
					}
					tot += spos[i];
				}
				if ( fl && tot != ball_cnt )
				{
					document.getElementById("spos_err").innerHTML = "There should be as many ones as there is balls.";
					res = false;
					fl = false;
				}
				if ( fl )
				{
					document.getElementById("spos_err").innerHTML = "";
				}
			}
		}
	}
	else
	{
		document.getElementById("spos_err").innerHTML = "";
	}
	
	var fl = true;
	var epos_str = document.getElementById("epos").value;
	if ( epos_str )
	{
		try
		{
			var epos = JSON.parse( epos_str );
		}
		catch ( err )
		{
			res = false;
		}
		if ( !Array.isArray( epos ) )
		{
			document.getElementById("epos_err").innerHTML = "Weights must be a vector of numbers.";
			res = false;
		}
		else
		{
			if ( epos.length !== max_t )
			{
				document.getElementById("epos_err").innerHTML = "Invalid quantity of values.";
				res = false;
			}
			else
			{
				var tot = 0;
				for ( var i=0; i < epos.length; i++ )
				{
					if ( epos[i] !== 1 && epos[i] !== 0 )
					{
						document.getElementById("epos_err").innerHTML = "Invalid value: " + epos[i];
						res = false;
						fl = false;
						break;
					}
					tot += epos[i];
				}
				if ( fl && tot != ball_cnt )
				{
					document.getElementById("epos_err").innerHTML = "There should be as many ones as there is balls.";
					res = false;
					fl = false;
				}
				if ( fl )
				{
					document.getElementById("epos_err").innerHTML = "";
				}
			}
		}
	}
	else
	{
		document.getElementById("epos_err").innerHTML = "";
	}
	return res;
}

function play ()
{
	if ( !validate() )
	{
		document.getElementById("seq").innerHTML = "There's errors in the given information.";
		return;
	}

	var balls = parseInt( document.getElementById("balls").value );
	var max = parseInt(document.getElementById("max").value );
	var ws = parseWeights( max );

	if ( balls && max && seql && ws )
	{
		var state_arr = [];
		for ( var i=0; i<max; i++ )
		{
			state_arr.push(0);
		}
		for ( var i=0; i<balls; i++ )
		{
			state_arr[i] = 1;
		}
		_play( state_arr, ws );
	}
	else
	{
		document.getElementById("seq").innerHTML = "Not all the parameters are given.";
	}
}

function _play ( state_arr, weights )
{
	var t = getRandomThrow( state_arr, weights );
	var a = new Audio("recs/"+t+".wav");
	a.play();
	state_arr = performThrow( state_arr, t );
	setTimeout(function ()
	{
		_play( state_arr, weights );
	}, 500);
}

function updateSeq ()
{
	if ( !validate() )
	{
		document.getElementById("seq").innerHTML = "There's errors in the given information.";
		return;
	}

	var balls = parseInt( document.getElementById("balls").value );
	var max = parseInt(document.getElementById("max").value );
	var seql = parseSeql();
	var ws = parseWeights( max );
	
	var spos_str = document.getElementById("spos").value;
	var spos = null;
	if ( spos_str )
	{
		spos = JSON.parse( spos_str );
	}
	var epos_str = document.getElementById("epos").value;
	var epos = null;
	if ( epos_str )
	{
		epos = JSON.parse( epos_str );
	}
	
	var time = (new Date().getTime()) + 10000;
	function timeout ()
	{
		return (new Date().getTime()) > time;
	}

	if ( balls && max && seql  )
	{
		var sarrs = getAllStates( balls, max );
		var seqs = [];
		if ( !spos && !epos )
		{
			sarrs.forEach(function ( sarr )
			{
				if ( timeout() ) return;
				seqs = seqs.concat( findSeqs( sarr, sarr, seql[0], seql[1] ) )
			});
		}
		else if ( !spos )
		{
			sarrs.forEach(function ( sarr )
			{
				if ( timeout() ) return;
				seqs = seqs.concat( findSeqs( sarr, epos, seql[0], seql[1] ) )
			});
		}
		else if ( !epos )
		{
			sarrs.forEach(function ( sarr )
			{
				if ( timeout() ) return;
				seqs = seqs.concat( findSeqs( spos, sarr, seql[0], seql[1] ) )
			});
		}
		else
		{
			seqs = ( findSeqs( spos, epos, seql[0], seql[1] ) )
		}
		
		for ( var i=0; i<seqs.length; i++ )
		{
			seqs[i] = autoShift( seqs[i] );
		}
		seqs = rmDublicateSeqs( seqs );
		
		var sseqs = wSortSeqs( seqs, ws );
		var rand = pickRandomSeq( seqs, ws );
		var str = "Random seq: " + rand + "<br>All ("+seqs.length+"):<br>";
		sseqs.forEach(function ( seq )
		{
			str += seq.seq + "<br>"
		});
		
		document.getElementById("seq").innerHTML = str;
	}
	else
	{
		document.getElementById("seq").innerHTML = "Not all the parameters are given.";
	}
}