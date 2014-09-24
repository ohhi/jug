function getPossibleThrows( state_arr )
{
	var result = [];
	if ( state_arr[0] )
	{
		state_arr.forEach(function ( val, i )
		{
			if ( !val )
			{
				result.push( i );
			}
		});
		result.push( state_arr.length );
	}
	else
	{
		result.push(0);
	}
	return result;
}

function performThrow ( state_arr, t )
{
	if ( t === 0 )
	{
		if ( state_arr[0] )
		{
			throw new Error("Trying to perform conflicting throw.");
		}
	}
	else
	{
		if ( !state_arr[0] )
		{
			throw new Error("Trying to perform throw when there's no ball");
		}
	}
	if ( state_arr[t] )
	{
		throw new Error("Trying to perform conflicting throw.");
	}
	var new_arr = [];
	for ( var i=1; i<state_arr.length; i++ )
	{
		new_arr.push( state_arr[i] );
	}
	new_arr.push(0);
	for ( var i=0; i<t; i++ )
	{
		if ( !new_arr[i] )
		{
			new_arr[i] = 0;
		}
	}
	if ( t !== 0)
	{
		new_arr[t-1] = 1;
	}
	return new_arr;
}

function getRandomThrow ( state_arr, weights )
{
	var pts = getPossibleThrows( state_arr );
	var pth = {};
	pts.forEach(function ( pt )
	{
		pth[pt] = true;
	});
	
	if ( !weights )
	{
		weights = [];
		state_arr.forEach(function ()
		{
			weights.push(1);
		});
		weights.push(1);
	}
	
	if ( state_arr.length + 1 !== weights.length )
	{
		throw new Error("Invalid weight array.");
	}
	
	var w_tot = 0;
	weights.forEach(function ( w, i )
	{
		if ( pth[i] )
		{
			if ( w === 0)
			{
				w = 0.01;
				weights[i] = w;
			}
			w_tot += w;
		}
		else
		{
			weights[i] = 0;
		}
	});
	
	var bs = [weights[0]/w_tot];
	for ( var i=1; i<weights.length; i++ )
	{
		bs.push(bs[i-1]+weights[i]/w_tot);
	}

	var r_val = Math.random();
	var t = 0;
	for ( var i=0; i<weights.length; i++ )
	{
		if ( r_val < bs[i] )
		{
			t = i;
			break;
		}
	}
	return t;
}

function getRandomSequence ( state_arr, l, weights )
{
	var seq = [];
	for ( var i=0; i<l; i++ )
	{
		var t = getRandomThrow( state_arr, weights );
		seq.push( t );
		state_arr = performThrow( state_arr, t );
	}
	return seq;
}

function getRandomSequence2 ( state_arr, l, weights )
{
	var seq = [];
	for ( var i=0; i<l; i++ )
	{
		var t = getRandomThrow( state_arr, weights );
		seq.push( t );
		state_arr = performThrow( state_arr, t );
	}
	return {
		seq : seq,
		end_state_arr : state_arr
	};
}

function getRandomState ( balls, max_h )
{
	var states = getAllStates( balls, max_h );
	return states[Math.round(Math.random()*(states.length-1))];
}

function getAllStates ( balls, max_h )
{
	var state_arrs = [];
	
	if ( balls > max_h )
	{
		// Nothing to do
	}
	else if ( balls === 0 )
	{
		var state_arr = [];
		for ( var i=0; i < max_h; i++ )
		{
			state_arr.push(0);
		}
		state_arrs.push( state_arr );
	}
	
	else if ( max_h === 1 )
	{
		state_arrs.push([1]);
	}
	
	else
	{
		var sub_states1 = getAllStates( balls - 1, max_h - 1 );
		sub_states1.forEach(function ( sub_state_arr )
		{
			state_arrs.push( [1].concat( sub_state_arr ) );
		});
		
		var sub_states2 = getAllStates( balls, max_h - 1 );
		sub_states2.forEach(function ( sub_state_arr )
		{
			state_arrs.push( [0].concat( sub_state_arr ) );
		});
	}
	
	return state_arrs;
}

function getStateCount ( balls, max_h )
{
	return fact( max_h ) / ( fact( balls ) * fact( max_h - balls ) );
}

function fact ( n )
{
	if ( n <= 1 )
	{
		return 1;
	}
	
	var ret = 1;
	for(var i=2;i<=n;++i)
	{
		ret *= i;
	}
	return ret;
} 

function getSeqWeight ( seq, weights )
{
	var w_tot = 0;
	weights.forEach(function ( w )
	{
		w_tot += w;
	});
	var seq_w_sum = 0;
	seq.forEach(function ( t )
	{
		seq_w_sum += weights[t];
	});
	return seq_w_sum / seq.length / w_tot;
}

function wSortSeqs ( seqs, weights )
{
	var wsa = [];
	
	seqs.forEach(function ( seq )
	{
		var w = getSeqWeight( seq, weights );
		wsa.push({
			weight : w,
			seq : seq
		})
	});
	return wsa.sort(function ( n1, n2 )
	{
		if ( n1.weight === n2.weight )
		{
			if ( n1.seq.length === n2.seq.length )
			{
				return 0;
			}
			return n1.seq.length < n2.seq.length ? -1 : 1;
		}
		else
		{
			return n1.weight > n2.weight ? -1 : 1;
		}
	});
}

function rmDublicateSeqs ( seqs )
{
	var sh = {};
	var rseqs = [];
	seqs.forEach(function ( seq )
	{
		if ( !sh[seq.toString()] )
		{
			sh[seq.toString()] = true;
			rseqs.push( seq );
		}
	});
	return rseqs;
}

function autoShift ( seq )
{
	var is = [];
	seq.forEach(function ( a, i )
	{
		is.push( i )
	});
	var seql = seq.length;
	is.sort(function ( s1, s2 )
	{
		for ( var i=0; i<seql; i++ )
		{
			var v1 = seq[(i+s1) % seql];
			var v2 = seq[(i+s2) % seql];
			if ( v1 < v2 ) return 1;
			if ( v2 < v1 ) return -1;
		}
		return 0;
	});
	
	var sseq = [];
	seq.forEach(function ( t, i )
	{
		sseq[(i-is[0]+seq.length) % seq.length] = t
	});
	return sseq;
}

function pickRandomSeq ( seqs, weights )
{
	var wsa = [];
	seqs.forEach(function ( seq )
	{
		var w = getSeqWeight( seq, weights );
		wsa.push( w )
	});
	var wsa_cn = calcNormalCumulation( wsa );
	var r_val = Math.random();
	var seq_i = 0;
	var seq = null;

	for ( var i=0; i < wsa_cn.length; i++ )
	{
		if ( r_val < wsa_cn[i] )
		{
			seq = seqs[i];
			break;
		}
	}
	return seq;
}

function calcNormalCumulation( a )
{
	var tot = 0;
	a.forEach(function ( v )
	{
		tot += v;
	});
	var nca = [0];
	a.forEach(function ( v, i )
	{
		nca.push( nca[i] + v / tot )
	});
	nca[nca.length-1] = 1;
	return nca.splice(1);
}

function findSeqs( state_arr1, state_arr2, min_d, max_d )
{
	min_d = min_d > 0 ? min_d : 1;
	max_d = max_d > min_d ? max_d : min_d;

	var seqs = [];
	var q = new List();
	
	q.pushBack({
		d : 0,
		s : state_arr1,
		pred : null
	});
	
	function getSuccs ( state_arr )
	{
		var ts = getPossibleThrows( state_arr );
		var arr = [];
		ts.forEach(function ( t )
		{
			arr.push( {
				t : t,
				s : performThrow( state_arr, t )
			})
		});
		return arr;
	}
	
	function seen ( sn )
	{
		if ( !sn.pred ) return false;
		var s = sn.s;
		var t = sn.pred.t;
		sn = sn.pred.sn;
		
		while ( sn.pred )
		{
			if ( sn.s.toString() === s.toString() && sn.pred.t === t )
			{
				return true;
			}
			sn = sn.pred.sn;
		}
		return false;
	}
	
	function traceSeq ( sn )
	{
		var seq = new List();
		while ( sn.pred )
		{
			seq.pushFront( sn.pred.t )
			sn = sn.pred.sn;
		}
		return seq.getArray();
	}
	
	while ( q.getLength() > 0 )
	{
		var sn = q.popFront();
		
		if ( seen( sn ) )
		{
			// Nothing to do.
		}
		
		else if ( sn.d > 0 && sn.s.toString() === state_arr2.toString() )
		{
			if ( sn.d >= min_d )
			{
				seqs.push( traceSeq( sn ) );
			}
		}
		
		else
		{
			if ( sn.d !== max_d )
			{
				getSuccs( sn.s ).forEach(function ( succ )
				{
					q.pushBack({
						d : sn.d + 1,
						s : succ.s,
						pred : {
							sn : sn,
							t : succ.t
						}
					});
				});
			}
		}
	}
	return seqs;
}

function getRandomCycle ( state_arr, l, weights )
{
	var not_found_yet = true;
	var obj = null;
	var cntr = 0;
	var limit = 1000000;
	while ( not_found_yet )
	{
		cntr++;
		obj = getRandomSequence2( state_arr, l, weights );
		if ( obj.end_state_arr.toString() === state_arr.toString() )
		{
			not_found_yet = false;
		}
		else if ( cntr === limit )
		{
			throw new Error("Search taking too long.");
		}
	}
	return obj.seq;
}

List = function ()
{
	this.tail = {
		prev : 0,
		next : 0,
		item : 0
	};
	this.head = {
		prev : 0,
		next : 0,
		item : 0
	};
	this.length = 0;
	
	this.head.next = this.tail;
	this.tail.prev = this.head;
};

List.prototype = {
	getItem : function ( node )
	{
		return node.item;
	},
	popFront : function ()
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var node = this.getFirst();
		var item = this.getItem( node );
		this.remove( node );
		return item;
	},
	popBack : function ()
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var node = this.getLast();
		var item = this.getItem( node );
		this.remove( node );
		return item;
	},
	getFirst : function ()
	{
	   return this.head.next; 
	},
	getLast : function ()
	{
	   return this.tail.prev; 
	},
	getNext : function ( node )
	{
		return node.next;
	},
	getPrevious : function ( node )
	{
		return node.prev;
	},
	replaceItem : function ( node, item )
	{
		node.item = item;
	},
	pushBack : function ( item )
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var new_node = {
			prev : this.tail.prev,
			next : this.tail,
			item : item
		};
		this.tail.prev.next = new_node;
		this.tail.prev = new_node;
		this.length++;
		return new_node;
	},
	pushFront : function ( item )
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var new_node = {
			prev : this.head,
			next : this.head.next,
			item : item
		};
		this.head.next.prev = new_node;
		this.head.next = new_node;
		this.length++;
		return new_node;
	},
	addBefore : function ( node, item )
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var new_node = {
			prev : node.prev,
			next : node,
			item : item
		};
		node.prev.next = new_node;
		node.prev = new_node;
		this.length++;
		return new_node;
	},
	addAfter : function ( node, item )
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var new_node = {
			prev : node,
			next : node.next,
			item : item
		};
		node.next.prev = new_node;
		node.next = new_node;
		this.length++;
		return new_node;
	},
	remove : function ( node )
	{
		//AssertBegin
		if ( this.lock )
		{
			throw new Error("Modifying list while iterating it.");
		}
		//AssertEnd
		
		var item = node.item;
		node.prev.next = node.next;
		node.next.prev = node.prev;
		node.prev = 0;
		node.next = 0;
		node.item = 0;
		this.length--;
		return item;
	},
	forEach : function ( fn )
	{
		//AssertBegin
		this.lock = true;
		//AssertEnd
		
		var i = this.head.next;
		while ( i !== this.tail )
		{
			fn.call( {}, i.item );
			i = i.next;
		}
		
		//AssertBegin
		this.lock = false;
		//AssertEnd
	},
	while : function ( fn )
	{
		var i = this.head.next;
		while ( i !== this.tail && fn.call( {}, i.item ) )
		{
			i = i.next;
		};
	},
	every : function ( fn )
	{
		var i = this.head.next;
		while ( i !== this.tail )
		{
			if ( !fn.call( {}, i.item ) )
			{
				return false;
			}
			i = i.next;
		}
		return true;
	},
	some : function ( fn )
	{
		var i = this.head.next;
		while ( i !== this.tail )
		{
			if ( fn.call( {}, i.item ) )
			{
				return true;
			}
			i = i.next;
		}
		return false;
	},
	map : function ( fn )
	{
		var i = this.head.next,
			l = new List();
		while ( i !== this.tail )
		{
			l.pushBack( fn.call( {}, i.item ) );
			i = i.next;
		}
		return l;
	},
	filter : function ( fn )
	{
		var i = this.head.next,
			l = new List();
		while ( i !== this.tail )
		{
			if ( fn.call( {}, i.item ) )
			{
				l.pushBack( i.item );
			}
			i = i.next;
		}
		return l;
	},
	concat : function ( list )
	{
		this.tail.prev.next = list.head.next;
		list.head.next.prev = this.tail.prev;
		this.tail = list.tail;
		list.head.next = 0;
		list.tail.prev = 0;
		this.length += list.length;
		list.length = 0;
	},
	getLength : function ()
	{
		return this.length;
	},
	getArray : function ()
	{
		var arr = [];
		var i = this.head.next;
		while ( i !== this.tail )
		{
			arr.push( i.item );
			i = i.next;
		}
		return arr;
	}
};

