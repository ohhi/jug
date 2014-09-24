function validate ()
{
	var res = true;
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

	var max_str = document.getElementById("max").value ;
	var max = parseInt( max_str );
	
	if ( max_str && !max && max !== 0 )
	{
		document.getElementById("max_err").innerHTML = "Invalid value. Must be a number.";
		res = false;
	}
	else if ( max_str && max < 0 )
	{
		document.getElementById("max_err").innerHTML = "Maximum height must be at least zero.";
		res = false;
	}
	else if ( max_str && balls_str && max < balls )
	{
		document.getElementById("max_err").innerHTML = "Maximum height must be at least as big as the amount of balls.";
		res = false;
	}
	else
	{
		document.getElementById("max_err").innerHTML = "";
	}
	
	var seql_str = document.getElementById("seql").value;
	var seql = parseInt( seql_str );

	if ( seql_str && !seql && seql !== 0 )
	{
		document.getElementById("seql_err").innerHTML = "Invalid value. Must be a number.";
		res = false;
	}
	else if ( seql_str && seql < 1 )
	{
		document.getElementById("seql_err").innerHTML = "Sequense length must be at least one.";
		res = false;
	}
	else
	{
		document.getElementById("seql_err").innerHTML = "";
	}

	var fl = true;
	var ws_str = document.getElementById("ws").value;
	try
	{
		var ws = JSON.parse( ws_str );
	}
	catch ( err )
	{
		res = false;
	}
	if ( !Array.isArray( ws ) )
	{
		document.getElementById("ws_err").innerHTML = "Weights must be a vector of numbers.";
		res = false;
	}
	else
	{
		if ( ws.length !== max + 1 )
		{
			document.getElementById("ws_err").innerHTML = "Invalid quantity of weight values.";
			res = false;
		}
		else
		{
			for ( var i=0; i < ws.length; i++ )
			{
				if ( typeof ws[i] !== "number" )
				{
					document.getElementById("ws_err").innerHTML = "Invalid weight: " + ws[i];
					res = false;
					fl = false;
					break;
				}
				if ( typeof ws[i] <= 0 )
				{
					document.getElementById("ws_err").innerHTML = "Weights must be positive: " + ws[i];
					res = false;
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

	var fl = true;
	var spos_str = document.getElementById("spos").value;
	if ( spos_str !== "" )
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
			if ( spos.length !== max )
			{
				document.getElementById("spos_err").innerHTML = "Invalid quantity of weight values.";
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
				if ( tot != balls )
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
	
	var fl = true;
	var epos_str = document.getElementById("epos").value;
	if ( epos_str !== "" )
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
			if ( epos.length !== max )
			{
				document.getElementById("epos_err").innerHTML = "Invalid quantity of weight values.";
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
				if ( tot != balls )
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
	var seql = parseInt(document.getElementById("seql").value );
	var ws = JSON.parse( document.getElementById("ws").value );

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
	var seql = parseInt(document.getElementById("seql").value );
	var ws = JSON.parse( document.getElementById("ws").value );
	
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
	
	if ( balls && max && seql  )
	{
		var sarrs = getAllStates( balls, max );
		var seqs = [];
		if ( !spos && !epos )
		{
			sarrs.forEach(function ( sarr )
			{
				seqs = seqs.concat( findSeqs( sarr, sarr, seql, seql ) )
			});
		}
		else if ( !spos )
		{
			sarrs.forEach(function ( sarr )
			{
				seqs = seqs.concat( findSeqs( sarr, epos, seql, seql ) )
			});
		}
		else if ( !epos )
		{
			sarrs.forEach(function ( sarr )
			{
				seqs = seqs.concat( findSeqs( spos, sarr, seql, seql ) )
			});
		}
		else
		{
			seqs = ( findSeqs( spos, epos, seql, seql ) )
		}
		
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